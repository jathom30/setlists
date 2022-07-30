import { SetlistFilters, SetlistSettings, Song } from 'typings'
import {v4 as uuid} from 'uuid'

function randomIntFromMax(max: number) {
  return Math.floor(Math.random() * max)
}

const getRandomSong = (songs: Song[]) => {
  const randomSong = songs[randomIntFromMax(songs.length)]
  const remainingSongs = songs.filter(song => song.id !== randomSong.id)
  return {
    randomSong,
    remainingSongs,
  }
}

export const setlistOfLength = (songs: Song[], setlistLength: number) => {
  let availableSongs = songs
  const newSet: Song[] = []
  let newSetLength = 0

  // check that the new setlist is shorter than requested...
  // AND that there are songs to choose from
  while (newSetLength < setlistLength && availableSongs.length > 0) {
    const {randomSong, remainingSongs} = getRandomSong(availableSongs)
    newSet.push(randomSong)
    availableSongs = remainingSongs
    newSetLength += randomSong.length
  }
  return newSet
}

export const setListsWithKeys = (setCount: number, setLength: number, songs: Song[]) => {
  const setlistKeys = Array.from({ length: setCount}, () => uuid())
  let availableSongs = songs
  const setlists = setlistKeys.reduce((sets, key) => {
    const set = {[key]: setlistOfLength(availableSongs, setLength)}
    availableSongs = availableSongs.filter(song => set[key].every(s => s.id !== song.id))
    return {
      ...sets,
      ...set
    }
  }, {})
  return setlists
}

export const filteredSongs = (filters: SetlistFilters, songs: Song[]) => {
  const {noCovers, onlyCovers, noBallads} = filters
  return songs.filter(song => {
    if (noCovers) {
      return !song.is_cover
    }
    if (onlyCovers) {
      return song.is_cover
    }
    if (noBallads) {
      return song.tempo !== 'ballad'
    }
    return !song.is_excluded
  })
}

export const autoGenSetlist = (intitialSongs: Song[], settings: SetlistSettings) => {
  const songs = filteredSongs(settings.filters, intitialSongs)
  const setlist = setListsWithKeys(settings.setCount, settings.setLength, songs)
  return setlist
}

// // prioritize openers and closers
// export const createSetlists = (setlistLength: number, numberOfSetlists: number, songs: Song[]) => {
//   // exclude songs marked as excluded
//   // ! filter ballads, covers, or originals according to config
//   const includedSongs = songs.filter(song => !song.is_excluded)
//   // create array of keys based on number of setlists needed
//   const setlistKeys = Array.from({length: numberOfSetlists}, () => uuid())
  
//   // organize songs by placement, when a song is selected, it is removed from the list so it can't get used again
//   let openers = includedSongs.filter(song => song.placement === 'opener')
//   let closers = includedSongs.filter(song => song.placement === 'closer')
//   let others = includedSongs.filter(song => song.placement === 'other')

//   // Preference is to fill sets with openers and closers, but there should be enough for each set
//   const preferredOpenerCount = Math.floor(openers.length / numberOfSetlists)
//   const preferredCloserCount = Math.floor(closers.length / numberOfSetlists)

//   // build the setlists
//   const setlists: {[key: string]: string[]} = setlistKeys.reduce((acc, setlistId) => {
//     // length keeps track of a set's time so the loop knows when the set is long enough
//     let length = 0
//     let openersInSet = 0
//     let closersInSet = 0
//     let setlist: Song[] = []
    
//     // add closers first to back fill
//     while (closers.length > 0 && closersInSet <= preferredCloserCount && length < setlistLength) {
//       const { randomSong, remainingSongs } = getRandomSong(closers)
//       setlist = [...setlist, randomSong]
//       closers = remainingSongs
//       closersInSet += 1
//       length += randomSong.length
//     }
//     // then add openers
//     while (openers.length > 0 && openersInSet < preferredOpenerCount && length < setlistLength) {
//       const { randomSong, remainingSongs } = getRandomSong(openers)
//       setlist = [randomSong, ...setlist]
//       openers = remainingSongs
//       openersInSet += 1
//       length += randomSong.length
//     }
//     // fill remaining space with "others"
//     while (others.length > 0 && length < setlistLength) {
//       const { randomSong, remainingSongs } = getRandomSong(others)
//       // insert "other" songs before closers
//       const closerIndex = setlist.findIndex(song => song.placement === 'closer')
//       setlist = [...setlist.slice(0, closerIndex), randomSong, ...setlist.slice(closerIndex)]
//       others = remainingSongs
//       length += randomSong.length
//     }

//     // check that only one ballad exists in the set, replace any additional ballads
//     let balladCount = setlist.filter(song => song.tempo === 'ballad')?.length || 0
//     let othersSansBallads = others.filter(song => song.tempo !== 'ballad')
//     const balladsPerHour = 1
//     const recommendedBalladsPerSet = Math.ceil(setlistLength / 60 / balladsPerHour)
//     while (balladCount > recommendedBalladsPerSet) {
//       const {randomSong, remainingSongs} = getRandomSong(othersSansBallads)
//       // get first ballad index
//       const balladIndex = setlist.findIndex(song => song?.tempo === 'ballad')
//       // subract its length from overall set length
//       length -= setlist[balladIndex]?.length
//       setlist = [...setlist.slice(0, balladIndex), randomSong, ...setlist.slice(balladIndex + 1)]
//       othersSansBallads = remainingSongs
//       // add length back with replacement song
//       length += randomSong?.length
//       // recalc ballad count to update while loop
//       balladCount = setlist.filter(song => song.tempo === 'ballad')?.length || 0
//     }

//     return {
//       ...acc,
//       // map setlist to ids so we can pull the actual song to the user instead of a copy
//       [setlistId]: setlist.map(song => song.id),
//     }
//   }, {})
  
//   return {
//     setlists,
//     ids: setlistKeys,
//   }
// }
