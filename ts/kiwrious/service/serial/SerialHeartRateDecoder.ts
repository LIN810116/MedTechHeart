import { SensorDecodedValue } from "../../data/SensorDecodedValue";
import { SensorReadResult } from "../../data/SensorReadResult";
import { HeartRateProcessor, HeartRateResult } from "./HeartRateProcessor";
import { SerialDecoder } from "./SerialDecoder";
import { SENSOR_VALUE, SerialRawValue } from "./SerialRawValue";

export class SerialHeartRateDecoder extends SerialDecoder {
    _processor: HeartRateProcessor;

    constructor() {
        super();

        this._processor = new HeartRateProcessor();
    }

    _log(...msg: any) {
        console.log('|SerialHeartRateDecoder|', ...msg);
    }

    decode(rawValue: SerialRawValue): SensorReadResult|null {
        // this._log('headers-footers', rawValue.header2Bytes, rawValue.footer2Bytes);

        const data0 = rawValue.getFourBytesByIndex(6);
        const data1 = rawValue.getFourBytesByIndex(10);
        const data2 = rawValue.getFourBytesByIndex(14);
        const data3 = rawValue.getFourBytesByIndex(18);

        //this._log('heartrate-values', data0, data1, data2, data3);

        const heartRateResult:HeartRateResult = this._processor.processMultiInput([data0, data1, data2, data3]);

        this._log('heartrate-result', heartRateResult.status, heartRateResult.value);

        const value0: SensorDecodedValue = { label: SENSOR_VALUE.HEART_RATE, value: heartRateResult, type: "object" };

        const result: SensorReadResult = {
            sensorType: rawValue.sensorType,
            decodedValues: [value0]
        };

        return result;
    }
}
