import { Song } from "typings"

const songCsvHeaders = ['name *', 'length *', 'is_cover', 'key_letter *', 'is_minor', 'tempo *', 'position', 'rank', 'feel']

const chunkArray = <T>(inputArray: T[], chunkSize: number) => inputArray.reduce((resultArray: T[][], item, index) => { 
  const chunkIndex = Math.floor(index / chunkSize)

  if(!resultArray[chunkIndex]) {
    resultArray[chunkIndex] = [] // start a new chunk
  }

  resultArray[chunkIndex].push(item)

  return resultArray
}, [])

export const readSongCSV = (csv: string) => {
  const commaSplit = csv.split(',')
  const lineSplit = commaSplit.map(item => item.split('\r\n')).flat()
  const extractHeaders = lineSplit.filter(item => songCsvHeaders.every(header => header !== item))
  const songArrays = chunkArray(extractHeaders, songCsvHeaders.length)
  
  const createSongs = songArrays.map(csvArray => {
    const feel = csvArray[8]?.toLowerCase().split('/') as Song['feel']
    return {
      name: csvArray[0],
      length: parseInt(csvArray[1]),
      is_cover: csvArray[2].toLowerCase() === 'true',
      key_letter: csvArray[3],
      is_minor: csvArray[4].toLowerCase() === 'true',
      tempo: parseInt(csvArray[5]),
      ...(csvArray[6] && {position: csvArray[6].toLowerCase() as Song['position']}),
      ...(csvArray[7] && {rank: csvArray[7].toLowerCase() as Song['rank']}),
      ...(feel?.length && {feel})
    }
  })
  return createSongs
}