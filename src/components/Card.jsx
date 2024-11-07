
import '../assets/css/card.css'


export default function Card(){
  return (
    <>
      <div className="tampah">
        <div className="kanji">
          <p className='tulisan_kanji'>図書館</p>
          <p className='pertanyaan'>apa arti dari kanji tersebut?</p>
        </div>
        <div className="pilihan">
          <button className='benar'>perpustakaan</button>
          <button className='salah'>kucing</button>
          <button className='salah'>laptop</button>
          <button className='salah'>kuil</button>
        </div>
      </div>
    </>
  )
}
   