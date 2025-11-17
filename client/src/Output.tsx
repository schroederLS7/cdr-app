import { Status, type DisplayMessage } from '../../server/src/interfaces/interfaces'
import successIcon from './assets/success.svg'
import errorIcon from './assets/error.svg'

export interface IDisplayOutputProps {
    outputDisplay: DisplayMessage[],
}

export interface ISendOutputProps {
    sendOutput: (input: DisplayMessage) => void;
}

export const Output: React.FunctionComponent<IDisplayOutputProps> = (props) => {
    const outputDisplay = props.outputDisplay;

    return (
        <div className="outputContainer">
            <h2>Output</h2>
            <div className="outputDisplayTable">
                <table>
                    <thead>
                        <th>Status</th>
                        <th>Message</th>
                        <th>Timestamp</th>
                    </thead>
                    {outputDisplay?.map(line => (
                        <tr key={line.timestamp}>
                            <td style={{ textAlign: "center" }}>
                                {line.status === Status.Error
                                    ? <img src={errorIcon} className="statusIcon" />
                                    : <img src={successIcon} className="statusIcon" />
                                }
                            </td>
                            <td>{line.message}</td>
                            <td>{line.timestamp}</td>
                        </tr>
                    ))}
                </table>
            </div>
        </div >
    )
};