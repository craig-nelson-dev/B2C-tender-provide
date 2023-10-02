import {
    Input,
    Button,
    Spinner,
    Box
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';



const UploadDeal = () => {
    const history = useHistory();
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        const auth_token = JSON.parse(localStorage.getItem('authToken'));
        if (!auth_token || auth_token.user.role === "customer") history.push('/404');
    }, []);

    const handleFileUpload = async (event) => {
        event.preventDefault();
        const file = event.target.file.files[0];
        const auth_token = JSON.parse(localStorage.getItem('authToken'));

        // Create a new FormData object
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Send a POST request to your server
            setLoading(true)
            const response = await fetch('https://chollitos.net/api/chollo/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    authorization: auth_token.token_type + " " + auth_token.access_token
                }
            });
            if (response.ok) {
                // File uploaded successfully
                history.push("/")
            } else {
                // Handle error if the file upload fails
                console.error('File upload failed');
                setLoading(false)
            }
        } catch (error) {
            console.error('Error occurred during file upload', error);
        }
    };
    return (
        <>
            {
                isLoading ? <Spinner /> :
                    <form onSubmit={handleFileUpload}>
                        <Input type="file" name="file" />
                        <Button type="submit" >Upload</Button>
                    </form>
            }
        </>
    )
}

export default UploadDeal;