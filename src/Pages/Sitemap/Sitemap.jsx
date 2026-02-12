import { useEffect, useState } from "react";
import { API_URL } from "../../Constants";

const Sitemap = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/sitemap.xml`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((xml) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "application/xml");
        const urlElements = doc.querySelectorAll("url");
        const parsed = Array.from(urlElements).map((u) => ({
          loc: u.querySelector("loc")?.textContent || "",
          lastmod: u.querySelector("lastmod")?.textContent || "",
          changefreq: u.querySelector("changefreq")?.textContent || "",
          priority: u.querySelector("priority")?.textContent || "",
        }));
        setUrls(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load sitemap:", err);
        setError("Failed to load sitemap. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 20, fontFamily: "monospace" }}>Loading sitemap...</div>;
  if (error) return <div style={{ padding: 20, fontFamily: "monospace", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "monospace", fontSize: "13px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h2 style={{ margin: "0 0 8px", fontSize: "16px" }}>XML Sitemap</h2>
      <p style={{ margin: "0 0 16px", color: "#555" }}>
        This sitemap contains {urls.length} URLs.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
        <thead>
          <tr style={{ background: "#4a90d9", color: "#fff", textAlign: "left" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>URL</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", width: "120px" }}>Priority</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", width: "120px" }}>Change Freq</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", width: "180px" }}>Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((u, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f0f0f0" }}>
              <td style={{ padding: "6px 8px", border: "1px solid #ddd", wordBreak: "break-all" }}>
                <a href={u.loc} style={{ color: "#4a90d9", textDecoration: "none" }}>{u.loc}</a>
              </td>
              <td style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "center" }}>{u.priority}</td>
              <td style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "center" }}>{u.changefreq}</td>
              <td style={{ padding: "6px 8px", border: "1px solid #ddd", textAlign: "center" }}>{u.lastmod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sitemap;
