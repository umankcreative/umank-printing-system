// terbilang.ts
function terbilang(num: number, kapitalAwal = false): string {
  if (num === 0) return kapitalAwal ? "Nol" : "nol";

  const angka = [
    "", "satu", "dua", "tiga", "empat", "lima",
    "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"
  ];

  function toWords(n: number): string {
    let str = "";

    if (n < 12) {
      str = angka[n];
    } else if (n < 20) {
      if (n === 11) {
        str = "sebelas";
      } else {
        str = toWords(n - 10) + " belas";
      }
    } else if (n < 100) {
      str = toWords(Math.floor(n / 10)) + " puluh " + toWords(n % 10);
    } else if (n < 200) {
      str = "seratus " + toWords(n - 100);
    } else if (n < 1000) {
      str = toWords(Math.floor(n / 100)) + " ratus " + toWords(n % 100);
    } else if (n < 2000) {
      str = "seribu " + toWords(n - 1000);
    } else if (n < 1000000) {
      str = toWords(Math.floor(n / 1000)) + " ribu " + toWords(n % 1000);
    } else if (n < 1000000000) {
      str = toWords(Math.floor(n / 1000000)) + " juta " + toWords(n % 1000000);
    } else if (n < 1000000000000) {
      str = toWords(Math.floor(n / 1000000000)) + " miliar " + toWords(n % 1000000000);
    } else if (n < 1000000000000000) {
      str = toWords(Math.floor(n / 1000000000000)) + " triliun " + toWords(n % 1000000000000);
    }

    return str.trim();
  }

  let hasil = toWords(num).replace(/\s+/g, " ").trim();

  if (kapitalAwal) {
    hasil = hasil.charAt(0).toUpperCase() + hasil.slice(1);
  }

  return hasil;
}

export default terbilang;
