import { Song } from "typings"

const getY = (tempo: string) => {
  // scale is based on 13 high svg
  // should make this more responsive
  switch (tempo) {
    case 'ballad':
      return 12
    case 'chill':
      return 9
    case 'medium':
      return 6
    case 'up':
      return 3
    case 'burner':
      return 1
    default:
      return 0
  }
}
const getX = (index: number, numberOfPoints: number, width: number) => {
  return width / numberOfPoints * index
}
export const getCoords = (set: Song[], width: number) =>
  set.map((song, i) => {
    return {
      x: getX(i, set.length - 1, width),
      y: getY(song.tempo),
    }
  })

export const getPointsWithCurve = (coords: {x: number, y: number}[]) => coords.map((coord, i) => {
  if (i === 0) {
    return `L ${coord?.x || 0} ${coord.y}`
  }
  // bezier curve X should be halfway betweet points
  const curveX = (coord.x + coords[i - 1].x) / 2
  // y1 is the prev point's y
  const y1 = coords[i - 1].y
  // y2 is current point's y
  const y2 = coord.y
  return `C ${curveX} ${y1}, ${curveX} ${y2} ${coord.x} ${coord.y}`
})