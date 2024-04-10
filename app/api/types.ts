export interface BaseResponse<T> {
  code: number
  message: string
  data: T | null
}

export type ExamLevel = 'A' | 'B' | 'C' | 'FULL'

export interface ExamQuestion {
  id: string
  question: string
  answerHash: string
  answerIndex: number
  picture: string | null
  options: string[]
  includeIn: Exclude<ExamLevel, 'FULL'>[]
}

export interface ExamBankResponse {
  level: ExamLevel
  questions: ExamQuestion[]
}


/* Satellite */
export type SatelliteStatus = 'alive' | 'dead' | 'future' | 're-entered'
export type SatelliteOperator = 'CIOMP' | 'ESA' | 'ISRO' | 'LSF' | 'None' | 'TU Berlin'

export interface Satellite {
  sat_id: string;
  norad_cat_id: number | null;
  norad_follow_id: number | null;
  name: string;
  names: string;
  image: string;
  status: SatelliteStatus;
  decayed: null;
  launched: Date | null;
  deployed: Date | null;
  website: string;
  operator: SatelliteOperator;
  countries: string;
  telemetries: {
    decoder: string;
  }[];
  updated: Date;
  citation: string;
  is_frequency_violator: boolean;
  associated_satellites: string[];
}

/* Transmitter */
export type TransmitterStatus = 'active' | 'inactive'
export type TransmitterType = 'Transceiver' | 'Transmitter' | 'Transponder'
export type TransmitterMode =
  'AFSK TUBiX10'
  | 'AFSK'
  | 'AHRPT'
  | 'AM'
  | 'APT'
  | 'ASK'
  | 'BPSK'
  | 'BPSK PMT-A3'
  | 'CERTO'
  | 'CW'
  | 'DBPSK'
  | 'DOKA'
  | 'DPSK'
  | 'DQPSK'
  | 'DSB'
  | 'DSTAR'
  | 'DUV'
  | 'DVB-S2'
  | 'FSK AX.100 Mode 5'
  | 'FSK AX.100 Mode 6'
  | 'FFSK'
  | 'FM'
  | 'FMN'
  | 'FSK'
  | 'FSK AX.25 G3RUH'
  | 'GFSK Rktr'
  | 'GFSK'
  | 'GFSK/BPSK'
  | 'GMSK'
  | 'GMSK USP'
  | 'HRPT'
  | 'LSB'
  | 'LoRa'
  | 'LRPT'
  | 'MSK AX.100 Mode 5'
  | 'MSK AX.100 Mode 6'
  | 'MFSK'
  | 'MSK'
  | 'OFDM'
  | 'OQPSK'
  | 'PSK'
  | 'PSK31'
  | 'QPSK'
  | 'QPSK31'
  | 'SSTV'
  | '4FSK'
  | 'USB'
  | 'WSJT'
export type TransmitterService =
  'Aeronautical'
  | 'Amateur'
  | 'Earth Exploration'
  | 'Fixed'
  | 'Inter-satellite'
  | 'Maritime'
  | 'Meteorological'
  | 'Mobile'
  | 'Radiolocation'
  | 'Radionavigational'
  | 'Space Operation'
  | 'Space Research'
  | 'Unknown'
export type TransmitterIaruCoordination = 'IARU Coordinated' | 'IARU Declined' | 'IARU Uncoordinated' | 'N/A'

export interface Transmitter {
  uuid: string;
  description: string;
  alive: boolean;
  type: TransmitterType;
  uplink_low: number | null;
  uplink_high: number | null;
  uplink_drift: number | null;
  downlink_low: number | null;
  downlink_high: number | null;
  downlink_drift: number | null;
  mode: TransmitterMode | null;
  mode_id: number | null;
  uplink_mode: TransmitterMode | null;
  invert: boolean;
  baud: number | null;
  sat_id: string;
  norad_cat_id: number;
  norad_follow_id: number | null;
  status: TransmitterStatus;
  updated: Date;
  citation: string;
  service: TransmitterService;
  iaru_coordination: TransmitterIaruCoordination;
  iaru_coordination_url: string;
  itu_notification: {
    urls: string[];
  };
  frequency_violation: boolean;
  unconfirmed: boolean;
}

/* TLE data set */
export interface LatestTleSet {
  tle0: string
  tle1: string
  tle2: string
  tle_source: string
  sat_id: string
  norad_cat_id: number
  updated: string
}
