import { useState } from "react";
import { CDR } from '../../server/src/classes/CDR';
import { DataTable } from "./DataTable";
import type { ISendOutputProps } from "./Output";

export const Query: React.FunctionComponent<ISendOutputProps> = (props) => {
    const sendOutput = props.sendOutput;
    const [CDRs, setCDRs] = useState<CDR[]>();

    const handleRunQueryClick = () => {
        const time = new Date().toLocaleTimeString();

        const queryString = (document.getElementById("queryInput") as HTMLInputElement).value;

        if (queryString.length == 0) {
            sendOutput({ status: 'Error', message: `Enter a query first.` });
            return;
        }

        fetch(`/api/runQuery?query=${queryString}`, {
            method: 'GET',
        }).then(response => response.json()).then(result => {
            if (result.status == "Success") {
                setCDRs(result.CDRs)
                sendOutput({ status: 'Success', message: `Data loaded - ${time}` });
            }
            sendOutput(result);
        });
    }

    return (
        <div className="queryContainer">
            <h2>Query CDR Data</h2>
            <div className="queryFieldContainer">
                <label htmlFor="queryInput">Enter your SQL query here:</label>
                <textarea id="queryInput" placeholder="SELECT * from calldetailrecords" />
            </div>
            <button name="loadDataButton" onClick={handleRunQueryClick}>Query Data from Database</button>
            {CDRs ? <DataTable CDRs={CDRs} /> : null}
        </div>
    )
};