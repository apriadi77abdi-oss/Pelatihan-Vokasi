
export enum Batch {
  BATCH_1 = 'Batch 1',
  BATCH_2 = 'Batch 2',
  BATCH_3 = 'Batch 3'
}

export enum Kejuruan {
  OTOMOTIF = 'Otomotif',
  LAS = 'Las',
  MANUFAKTUR = 'Manufaktur',
  PENDINGIN = 'Pendingin',
  LISTRIK = 'Listrik',
  ELEKTRONIKA = 'Elektronika',
  BANGUNAN = 'Bangunan',
  TIK = 'TIK',
  BISNIS_MANAJEMEN = 'Bisnis dan Manajemen',
  GARMEN = 'Garmen',
  TATA_KECANTIKAN = 'Tata Kecantikan',
  PARIWISATA = 'Pariwisata'
}

export enum JenisPelatihan {
  PBK = 'PBK',
  PBL = 'PBL',
  GREENJOB = 'Greenjob'
}

export interface TrainingData {
  id: string;
  timestamp: string;
  batch: Batch;
  kejuruan: Kejuruan;
  namaProgram: string;
  jenisPelatihan: JenisPelatihan;
  jumlahJP: number;
  pesertaSiapKerja: number;
  pesertaLulus: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  pic: string;
}

export const TARGET_TOTAL = 1712;
