import { CDR } from '../../server/src/classes/CDR';

export interface IDataTableProps {
    CDRs: CDR[]
}

export const DataTable: React.FunctionComponent<IDataTableProps> = (props) => {
    const CDRs = props.CDRs;

    return (
        <table className='cdrTable'>
            <thead>
                <tr>
                    <th>id</th>
                    <th>mnc</th>
                    <th>bytes_used</th>
                    <th>dmcc</th>
                    <th>cell_id</th>
                    <th>ip</th>
                </tr>
            </thead>
            <tbody>
                {CDRs.map((cdr) =>
                (<tr>
                    <td>{cdr.id}</td>
                    <td>{cdr.mnc}</td>
                    <td>{cdr.bytes_used}</td>
                    <td>{cdr.dmcc}</td>
                    <td>{cdr.cell_id}</td>
                    <td>{cdr.ip}</td>
                </tr>
                ))}
            </tbody>
        </table>
    )
};