import { SensorDecodedValue } from "../../data/SensorDecodedValue";
import { SensorReadResult } from "../../data/SensorReadResult";
import { HeartRateProcessor, HeartRateResult } from "./HeartRateProcessor";
import { SerialDecoder } from "./SerialDecoder";
import { SENSOR_VALUE, SerialRawValue } from "./SerialRawValue";

export class SerialHeartRateDecoder extends SerialDecoder {
    _processor: HeartRateProcessor;
    _detector: HeartRateDetector;

    constructor() {
        super();

        this._processor = new HeartRateProcessor();
        
        // Detector 
        this._detector = new HeartRateDetector();
    }

    _log(...msg: any) {
        console.log('|SerialHeartRateDecoder|', ...msg);
    }

    async decode(rawValue: SerialRawValue): Promise<SensorReadResult>|null {
        // this._log('headers-footers', rawValue.header2Bytes, rawValue.footer2Bytes);

        const rawData = rawValue.rawValue.subarray(6,22);
        const heartRateResult = await this._detector.detectHeartRate(rawData);

        this._log('heartrate-result', heartRateResult);

        const value0: SensorDecodedValue = { label: SENSOR_VALUE.HEART_RATE, value: heartRateResult, type: "object" };

        const result: SensorReadResult = {
            sensorType: rawValue.sensorType,
            decodedValues: [value0]
        };

        return result;
    }
}
