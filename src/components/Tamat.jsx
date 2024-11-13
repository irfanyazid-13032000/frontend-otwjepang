import '../assets/css/tamat.css';


export default function Tamat({soalHabis, tryAgain}) {
  return  (
    <div className={`papanSelamat ${soalHabis == true  ?'block':'none'}`}>
      <div className="ucapan">
      <p className='selamat'>selamat!! kamu sudah menamatkan game ini</p>
      <button className='x' onClick={tryAgain}>Play Again</button>
      </div>
    </div>
  )
}