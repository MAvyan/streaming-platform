import type { TopVideo } from '../../lib/api'
import { fullNumber } from '../../lib/format'
import './TopVideosTable.css'

export function TopVideosTable({ data }: { data: TopVideo[] }) {
  const max = Math.max(...data.map((d) => d.views), 1)

  return (
    <div className="top-table__scroll">
      <table className="top-table">
        <thead>
          <tr>
            <th className="top-table__rank">#</th>
            <th>Titre</th>
            <th>Catégorie</th>
            <th className="top-table__num">Visionnages</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => (
            <tr key={v.videoId}>
              <td className="top-table__rank">{i + 1}</td>
              <td className="top-table__title">{v.title}</td>
              <td>
                <span className="top-table__cat">{v.category}</span>
              </td>
              <td className="top-table__num">
                <div className="top-table__value">
                  <span className="top-table__bar" style={{ width: `${(v.views / max) * 100}%` }} />
                  <span>{fullNumber(v.views)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
