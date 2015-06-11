package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
	"github.com/lazyshot/go-hbase"

	"net/http"
	"os"
	"strconv"
	"strings"
)

func main() {
	r := gin.Default()
	hclient := hbase.NewClient([]string{os.Getenv("HBASE_URL")}, os.Getenv("HBASE_PATH"))

	api := r.Group("/api")
	{
		api.GET("/tables", func(c *gin.Context) {
			c.JSON(200, hclient.GetTables())
		})

		api.GET("/tables/:table", func(c *gin.Context) {
			var err error = nil

			table := c.Param("table")
			startKey := c.DefaultQuery("startKey", "")
			endKey := c.DefaultQuery("endKey", "")
			columns := strings.Split(c.Query("column"), ",")

			limit := 25
			if c.Query("limit") != "" {
				l, _ := strconv.Atoi(c.Query("limit"))
				if l > 0 {
					limit = l
				}
			}

			scan := hclient.Scan(table)

			scan.StartRow = []byte(startKey)
			scan.StopRow = []byte(endKey)

			for _, col := range columns {
				if col != "" {
					scan.AddString(col)
				}
			}

			rows := make([]map[string]interface{}, 0)
			n := 0
			scan.Map(func(r *hbase.ResultRow) {
				rows = append(rows, ResultRowToMap(r))
				n++

				if n >= limit {
					scan.Close()
				}
			})

			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
			} else {
				c.JSON(200, rows)
			}
		})
	}

	r.NoRoute(func() gin.HandlerFunc {
		fs := assetFS()
		fileserver := http.FileServer(fs)

		return func(c *gin.Context) {
			i, err := AssetInfo("dist/" + strings.TrimPrefix(c.Request.URL.Path, "/"))
			if err != nil {
				i, _ = AssetInfo("dist/index.html")
				f, _ := fs.Open("index.html")
				http.ServeContent(c.Writer, c.Request, i.Name(), i.ModTime(), f)
			} else {
				fileserver.ServeHTTP(c.Writer, c.Request)
			}
		}
	}())

	port := os.Getenv("PORT")
	if port == "" {
		port = "8888"
	}

	r.Run(":" + port)
}

func ResultRowToMap(rr *hbase.ResultRow) map[string]interface{} {
	res := make(map[string]interface{})

	res["key"] = rr.Row.String()

	for _, col := range rr.SortedColumns {
		fam := col.Family.String()
		qual := col.Qualifier.String()

		if _, ok := res[fam]; !ok {
			res[fam] = make(map[string]string)
		}

		if m, ok := res[fam].(map[string]string); ok {
			m[qual] = col.Value.String()
		}
	}

	return res
}
