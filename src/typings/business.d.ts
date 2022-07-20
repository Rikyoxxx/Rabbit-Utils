declare namespace Verse {
  type VersePeriod = 1 | 2 // 1 晨祷 2晚祷

  interface Verse {
    key: string
    date: string
    period: VersePeriod
    verse: string
    book: string
    chapterNo: number
    verseNo: number
    inspiration: string
    prayer: string
    tags: string[]
    cover: string
  }

  interface VerseFromXlsx extends Omit<Verse, 'cover' | 'tags' | 'period'> {
    period: string
    tags: string
    [key: string]: any
  }

  interface VerseListWithAdapter {
    pageCount: number
    pageSize: number
    list: Verse[]
  }
}
