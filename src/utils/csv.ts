import { Song } from "typings"

const songCsvHeaders = ['name *', 'length *', 'is_cover', 'key_letter *', 'is_minor', 'tempo *', 'position', 'rank']
const cleanedHeaders = songCsvHeaders.map(header => header.replace(' *', ''))

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
    // TODO loop through cleanedHeaders at index incase number of headers or order changes also clean up typecasting
    return {
      name: csvArray[0],
      length: parseInt(csvArray[1]),
      is_cover: csvArray[2] ? true : false,
      key_letter: csvArray[3],
      is_minor: csvArray[4] ? true : false,
      tempo: csvArray[5],
      ...(csvArray[6] && {position: csvArray[6] as Song['position']}),
      ...(csvArray[7] && {rank: csvArray[7] as Song['rank']}),
    }
  })
  return createSongs
}