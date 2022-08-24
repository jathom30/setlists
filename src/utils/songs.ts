import { Song } from "typings"

export const filterByTempo = (songs: Song[], tempos: string[]) => {
  if (tempos.length === 0) {
    return songs
  }
  return songs.filter(song => tempos.some(tempo => {
    switch (tempo) {
      case 'ballad':
        return 1 === song.tempo
      case 'down':
        return 2 === song.tempo
      case 'medium':
        return 3 === song.tempo
      case 'up':
        return 4 === song.tempo
      case 'burner':
        return 5 === song.tempo
      default:
        return false
    }
  })
  )
}

export const filterByFeel = (songs: Song[], feels: string[]) => {
  if (feels.length === 0) {
    return songs
  }
  return songs.filter(song => feels.some(feel => song.feel?.some(f => f === feel)))
}

export const filterByCover = (songs: Song[], cover: string[]) => {
  if (cover.length === 0) {
    return songs
  }
  return songs.filter(song => cover.some(c => {
    switch (c) {
      case 'Is a cover':
        return song.is_cover
      case 'Is an original':
        return !song.is_cover
      default:
        return false
    }
  }))
}

export const filterByPosition = (songs: Song[], positions: string[]) => {
  if (positions.length === 0) { return songs }
  return songs.filter(song => positions.some(position => (song.position ?? 'other') === position))
}