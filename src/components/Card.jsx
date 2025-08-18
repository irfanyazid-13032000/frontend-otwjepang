import '../assets/css/card.css';
import { useEffect, useState } from 'react';
import kanjiData from '../data/kanji.json';
import Score from "./Score";
import Tamat from "./Tamat";
import Sumbangan from "./Sumbangan";

export default function Card() {
  const [page, setPage] = useState(1);
  const [acakData, setAcakData] = useState([]);
  const [soalKanji, setSoalKanji] = useState('');
  const [pilihanGanda, setPilihanGanda] = useState([]);
  const [noSoal, setNoSoal] = useState(0);

  const [sudahDijawab, setSudahDijawab] = useState(0);
  const [nyawa, setNyawa] = useState(3);
  const [salahMenjawab, setSalahMenjawab] = useState(0);
  const [nilaiJawabanUser, setNilaiJawabanUser] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [listScore, setListScore] = useState([]);
  const [soalHabis, setSoalHabis] = useState(false);
  const [sumbangan, setSumbangan] = useState(false);
  const [clicked, setClicked] = useState(false);

  const perPage = 5;
  const lastPage = Math.ceil(kanjiData.length / perPage);

  // ambil data per halaman
  function getPaginatedData(page) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return kanjiData.slice(start, end);
  }

  // tiap kali ganti page, data diacak
  useEffect(() => {
    const pageData = getPaginatedData(page);
    if (pageData.length > 0) {
      setAcakData([...pageData].sort(() => 0.5 - Math.random()));
      setNoSoal(0);
    } else {
      setSoalHabis(true);
    }
  }, [page]);

  // bikin soal tiap kali pindah soal
  useEffect(() => {
    if (acakData.length > 0 && noSoal < acakData.length) {
      buatSoal(noSoal);
    }
  }, [acakData, noSoal]);

function buatSoal(soalNo) {
  if (!acakData[soalNo]) return; // kalo data kosong, stop

  let kanjiText = acakData[soalNo]?.kanji || 'Data tidak tersedia';
  setSoalKanji(kanjiText);
  let arti = acakData[soalNo]?.arti || 'Data tidak tersedia';

  // ambil semua arti dari 1 halaman
  let teksArtiPilihanGanda = acakData.map((item) => item.arti);

  // filter supaya gak ada jawaban duplikat
  let teksArtiTanpaJawaban = teksArtiPilihanGanda.filter((t) => t !== arti);

  // ambil 3 random
  let acakTigaArti = teksArtiTanpaJawaban.sort(() => 0.5 - Math.random()).slice(0, 3);

  let result = [
    ...acakTigaArti.map((teks) => ({ value: teks, status: false, class: 'salah' })),
    { value: arti, status: true, class: 'benar' },
  ];

  setPilihanGanda(result.sort(() => 0.5 - Math.random()));
}



  const nextSoal = (status) => {
  setClicked(true);
  setNilaiJawabanUser(status);

    const playSound = (path) => {
    const audio = new Audio(path);
    audio.play();
  };

  if (status === true) {
     playSound('/sound/benar.mp3');
  }else{
      playSound('/sound/salah.mp3');
  }
  setTimeout(() => {
    if (status === true) {
     
      setSudahDijawab((prev) => prev + 1);

      if (noSoal + 1 < acakData.length) {
        // masih ada soal di halaman ini
        setNoSoal((prev) => prev + 1);
      } else {
        // soal di halaman ini habis
        if (page < lastPage) {
          setPage((prev) => prev + 1);
          setNoSoal(0);
        } else {
          // semua halaman habis
          setSoalHabis(true);
        }
      }
    } else {
      setNyawa((sisa) => sisa - 1);
      setSalahMenjawab((s) => s + 1);

      if (nyawa - 1 < 1) {
        setListScore([...listScore, sudahDijawab]);
         playSound('/sound/gameover.mp3');
        setGameOver(true);
      }
    }

    setNilaiJawabanUser(null);
    setClicked(false);
  }, 500);
};


  const tryAgain = () => {
    setClicked(false);
    setNilaiJawabanUser(null);
    setSumbangan(false);
    setSoalHabis(false);
    setGameOver(false);
    setPage(1);
    setSudahDijawab(0);
    setNyawa(3);
    setSalahMenjawab(0);
  };

  return (
    <>
      <Sumbangan sumbangan={sumbangan} setGameOver={setGameOver} setSumbangan={setSumbangan}/>
      <Tamat soalHabis={soalHabis} tryAgain={tryAgain}/>
      <Score gameOver={gameOver} tryAgain={tryAgain} listScore={listScore} sudahDijawab={sudahDijawab}/>

      <div className={`penampung ${gameOver || soalHabis || sumbangan ? "none" : "block"}`}>
        <div className={`tampah ${nilaiJawabanUser === true ? "kamubenar" : nilaiJawabanUser === false ? "kamusalah" : ""}`}>
          <div className="bar">
            <table>
              <thead>
                <tr>
                  <td>
                    {nyawa > 0 && Array(nyawa).fill("🍔").map((heart, i) => <span key={i}>{heart}</span>)}
                    {salahMenjawab > 0 && Array(salahMenjawab).fill("💩").map((x, i) => <span key={i}>{x}</span>)}
                  </td>
                  <td>Score : {sudahDijawab}</td>
                </tr>
              </thead>
            </table>
          </div>

          <div className="kanji">
            <p className="tulisan_kanji">{soalKanji}</p>
            <p className="pertanyaan">Apa arti dari kanji tersebut?</p>
          </div>

          <div className="pilihan">
            {pilihanGanda.map((item, index) => (
              <button
                key={index}
                className={`buttonPilihan ${clicked ? item.class : ''}`}
                onClick={() => nextSoal(item.status)}
              >
                {item.value}
              </button>
            ))}
          </div>
        </div>

        {listScore.length > 2 && (
          <>
            <p className='mengajakMenyumbang'>seru kan? Mau dong nyumbang?</p>
            <button className='sumbangButton' onClick={() => setSumbangan(true)}>Sumbanglah Diriku ini Plisss😭</button>
          </>
        )}
      </div>
    </>
  );
}
