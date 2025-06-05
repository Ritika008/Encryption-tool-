async function handleOperation(operation) {
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('status');
    
    if (!fileInput.files.length) {
        showStatus('Please select a file first', 'error');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('operation', operation);

    try {
        // Replace with your actual backend endpoint
        const response = await fetch(`/api/${operation}`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${operation}ed_${file.name}`;
            a.click();
            window.URL.revokeObjectURL(url);
            showStatus(`File ${operation}ed successfully!`, 'success');
        } else {
            throw new Error(`Failed to ${operation} file`);
        }
    } catch (error) {
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