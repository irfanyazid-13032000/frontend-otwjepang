import '../assets/css/card.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSoal } from '../slices/soalSlice';
import  Score  from "./Score";
export default function Card() {
  const { data, loading, error,lastPage } = useSelector((state) => state.soal);
  const [clicked, setClicked] = useState(false);
  const [soalKanji, setSoalKanji] = useState('');
  const [pilihanGanda, setPilihanGanda] = useState([]);
  const [acakData, setAcakData] = useState([]);
  const [noSoal, setNoSoal] = useState(0);
  const [page,setPage] = useState(1);
  const [sudahDijawab,setSudahDijawab] = useState(0);
  const [nyawa,setNyawa] = useState(3);
  const [salahMenjawab,setSalahMenjawab] = useState(0);
  const [nilaiJawabanUser,setNilaiJawabanUser] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [listScore, setListScore] = useState([])
  

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSoal(page));
  }, [dispatch,page]);

  useEffect(() => {
    if (data.length > 0) {
      setAcakData([...data].sort(() => 0.5 - Math.random()));
      setNoSoal(0)
    }
  }, [data, loading]);

  useEffect(() => {
    if (acakData.length > 0 && noSoal < acakData.length) {
      buatSoal(noSoal);
    }
  }, [acakData, noSoal]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  function buatSoal(soalNo) {
    if (soalNo >= acakData.length - 1) {
      if (page >= lastPage) {
        alert("udah habis ini soalnya")
        return
      }
      setPage((prevPage) => prevPage + 1);
    }
    
    
    let kanjiText = acakData && acakData[soalNo] ? acakData[soalNo].kanji.teks_kanji : 'Data tidak tersedia';
    setSoalKanji(kanjiText);
    let arti = acakData && acakData[soalNo] ? acakData[soalNo].arti.teks_arti : 'Data tidak tersedia';

    // Mengumpulkan teks_arti dari setiap objek di array data
    let teksArtiPilihanGanda = data.map((item) => item.arti.teks_arti);

    let teksArtiTanpaJawabanSebenarnya = teksArtiPilihanGanda.filter((teks) => teks !== arti);

    // Mengacak array hasil filter dan mengambil 3 elemen pertama
    let acakTigaArti = teksArtiTanpaJawabanSebenarnya
      .sort(() => 0.5 - Math.random()) // Mengacak array
      .slice(0, 3); // Mengambil 3 elemen pertama

    // Menambahkan objek arti dengan status 'benar' ke dalam array
    let result = [
      ...acakTigaArti.map((teks) => ({
        value: teks,
        status: false,
        class: 'salah', // Bisa diganti sesuai kebutuhan
      })),
      { value: arti, status: true, class: 'benar' },
    ];

    // Mengacak seluruh array (termasuk arti yang baru ditambahkan)
    let finalResult = result.sort(() => 0.5 - Math.random());
    setPilihanGanda(finalResult);
  }

  const nextSoal = (status) => {
    setClicked(true);
    setNilaiJawabanUser(status)
      setTimeout(() => {
 // jika menjawab benar
        if (status == true) {
          // Increment the question number
          setNoSoal((prevNoSoal) => {
            const newNoSoal = prevNoSoal + 1;
            return newNoSoal;
          });

          setSudahDijawab((soalYangDijawab)=>{
            const soalTerjawab = soalYangDijawab + 1
            return soalTerjawab
          })
// jika menjawab salah
        }else{
          setNyawa((sisaNyawa)=>{
            const newNyawa = sisaNyawa - 1;
            return newNyawa
          })

          setSalahMenjawab((sisaSalahJawab)=>{
            const newSalahMenjawab = sisaSalahJawab + 1;
            return newSalahMenjawab
          })

          setNoSoal((prevNoSoal) => {
            const newNoSoal = prevNoSoal;
            return newNoSoal;
          });

          if (nyawa < 1) {
            setListScore([...listScore,sudahDijawab])
            setGameOver(true)
          }
          
        }
       

        setNilaiJawabanUser(null)
        setClicked(false);
      }, 500);
      
  };



  const tryAgain = () => {
    setGameOver(false)
    setPage(1)
    setSudahDijawab(0)
    setNyawa(3)
    setSalahMenjawab(0)
    dispatch(fetchSoal(page));
  }

  return (
    <>
    <Score gameOver={gameOver} tryAgain={tryAgain} listScore={listScore} sudahDijawab={sudahDijawab}/>
    <div className={`penampung ${gameOver == true ? "none" : "block"}`}>
     <div className={`tampah ${nilaiJawabanUser === true ? "kamubenar" : nilaiJawabanUser === false ? "kamusalah" : ""}`}>
        <div className="bar">
          <table>
            <thead>
              <tr>
                <td>
                {nyawa > 0 ? (
                  Array(nyawa).fill("❤️").map((heart, index) => (
                    <span key={index}>{heart}</span>
                  ))
                ) : ''}
                {salahMenjawab > 0 ? (
                  Array(salahMenjawab).fill("❤").map((heart, index) => (
                    <span key={index}>{heart}</span>
                  ))
                ) : ''}
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
              className={clicked === true ? item.class : ''}
              onClick={() => nextSoal(item.status)}
            >
              {item.value}
            </button>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
