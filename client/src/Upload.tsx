import type { ISendOutputProps } from "./Output";

export const Upload: React.FunctionComponent<ISendOutputProps> = (props) => {
    const sendOutput = props.sendOutput;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (event.target) {
            event.preventDefault();
            const form = document.getElementById('uploadForm') as HTMLFormElement;
            const formData = new FormData(form);

            fetch('/api/upload', {
                method: 'POST',
                body: formData,
            }).then(response => response.json()).then(result => {
                sendOutput(result);
            });
        }
    }

    return (
        <div className="uploadContainer">
            <h2>Upload a Call Detail Record (CDR) file</h2>
            <form className="uploadForm" id="uploadForm" onSubmit={handleSubmit}>
                <input type="file" name="uploadedFile" onChange={() => { (document.getElementById("submitButton") as HTMLButtonElement).disabled = false; }} />
                <button type="submit" name="submitButton">Upload selected file</button>
            </form>
        </div>
    )
};