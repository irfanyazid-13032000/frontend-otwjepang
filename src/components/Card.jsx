import '../assets/css/card.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSoal } from '../slices/soalSlice';

export default function Card() {
  const { data, loading, error,lastPage } = useSelector((state) => state.soal);
  const [clicked, setClicked] = useState(false);
  const [soalKanji, setSoalKanji] = useState('');
  const [pilihanGanda, setPilihanGanda] = useState([]);
  const [acakData, setAcakData] = useState([]);
  const [noSoal, setNoSoal] = useState(0);
  const [page,setPage] = useState(5);
  const [sudahDijawab,setSudahDijawab] = useState(0);
  const [nyawa,setNyawa] = useState(3);
  const [salahMenjawab,setSalahMenjawab] = useState(0);
  

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

      setTimeout(() => {
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
        }
  
        setClicked(false);
      }, 500);
      
  };

  return (
    <>
      <div className="tampah">
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
    </>
  );
}
