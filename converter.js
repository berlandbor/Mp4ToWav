import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });
const convertButton = document.getElementById('convertButton');
const inputFile = document.getElementById('inputFile');
const progressDiv = document.getElementById('progress');
const downloadLink = document.getElementById('downloadLink');

convertButton.addEventListener('click', async () => {
    if (!inputFile.files.length) {
        alert('Please select an MP4 file.');
        return;
    }

    const file = inputFile.files[0];

    if (!ffmpeg.isLoaded()) {
        progressDiv.textContent = 'Loading FFmpeg...';
        await ffmpeg.load();
    }

    progressDiv.textContent = 'Converting...';

    try {
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

        await ffmpeg.run('-i', 'input.mp4', 'output.mp3');

        const data = ffmpeg.FS('readFile', 'output.mp3');

        const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        downloadLink.href = url;
        downloadLink.download = 'output.mp3';
        downloadLink.textContent = 'Download MP3';
        downloadLink.style.display = 'block';

        progressDiv.textContent = 'Conversion complete!';
    } catch (error) {
        progressDiv.textContent = 'An error occurred during conversion.';
        console.error(error);
    }
});