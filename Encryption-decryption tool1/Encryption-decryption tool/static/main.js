async function handleOperation(operation) {
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('status');
    
    if (!fileInput.files.length) {
        showStatus('Please select a file first', 'error');
        return;
    }

    try {
        showStatus('Processing...', 'success');
        
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/${operation}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Failed to ${operation} file: ${response.statusText}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        // Create and trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = `${operation}ed_${file.name}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Cleanup
        window.URL.revokeObjectURL(downloadUrl);
        showStatus(`File ${operation}ed successfully!`, 'success');
        
        // Reset file input
        fileInput.value = '';
        document.querySelector('.file-label').textContent = 'Choose a file';
        
    } catch (error) {
        console.error(error);
        showStatus(error.message, 'error');
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}

// File input visual feedback
document.getElementById('fileInput').addEventListener('change', function(e) {
    const label = document.querySelector('.file-label');
    if (e.target.files.length) {
        label.textContent = e.target.files[0].name;
    } else {
        label.textContent = 'Choose a file';
    }
});