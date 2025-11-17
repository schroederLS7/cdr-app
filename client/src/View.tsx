import { useState } from "react";
import { CDR } from '../../server/src/classes/CDR';
import { DataTable } from "./DataTable";
import type { ISendOutputProps } from "./Output";

export const View: React.FunctionComponent<ISendOutputProps> = (props) => {
    const sendOutput = props.sendOutput;
    const [CDRs, setCDRs] = useState<CDR[]>();

    const handleLoadClick = () => {
        fetch('/api/getAll', {
            method: 'GET',
        }).then(response => response.json()).then(result => {
            if (result.status == "Success") {
                setCDRs(result.CDRs)
            }
            sendOutput(result);
        });
    }

    return (
        <div className="viewContainer">
            <h2>View CDR Data</h2>
            <button name="loadDataButton" onClick={handleLoadClick}>Get Data from Database</button>
            {CDRs ? <DataTable CDRs={CDRs} /> : null}
        </div>
    )
};