document.addEventListener('DOMContentLoaded', () => {
    // Select containers and elements from the DOM
    const receivedMessagesContainer = document.getElementById('receivedMessages'); 
    // Container for received messages
    const sentMessagesContainer = document.getElementById('sentMessages'); 
    // Container for sent messages
    const replyModal = new bootstrap.Modal(document.getElementById('replyModal')); 
    // Bootstrap modal for replying to messages
    const replyMessagePreview = document.getElementById('replyMessagePreview'); 
    // Element to display the preview of the message being replied to
    const replyMessageContent = document.getElementById('replyMessageContent'); 
    // Textarea for writing the reply content
    const sendReplyBtn = document.getElementById('sendReplyBtn'); 
    // Button to send the reply

    let replyToMessageId = null; 
    // Variable to track the ID of the message being replied to

    // Fetch messages from the server
    async function fetchMessages() {
        try {
            const response = await fetch('/api/messages'); 
            const { received_messages, sent_messages } = await response.json(); 

            populateMessages(receivedMessagesContainer, received_messages, true); 
            populateMessages(sentMessagesContainer, sent_messages, false); 
        } catch (err) {
            console.error('Error fetching messages:', err); 
            // Log errors to the console
        }
    }

    // Populate messages into a container
    function populateMessages(container, messages, isReceived) {
        if (!messages.length) {
            // Display a message if no messages are found
            container.innerHTML = `<p class="text-muted text-center">${isReceived ? 'No received messages.' : 'No sent messages.'}</p>`;
            return;
        }

        // Map through the messages array and generate HTML for each message
        container.innerHTML = messages
            .map((msg) => {
                const username = isReceived ? msg.sender : msg.recipient; 
                // Determine whether to display the sender or recipient
                const timestamp = new Date(msg.timestamp).toLocaleString(); 
                // Format the timestamp into a readable string
                return `
                    <div class="message ${isReceived ? 'received' : 'sent'}">
                        <p><strong>${username}</strong></p>
                        <p>${msg.content}</p>
                        <small class="text-muted">${timestamp}</small>
                        ${
                            isReceived
                                ? `<button class="btn btn-link reply-btn" data-id="${msg.id}" data-content="${msg.content}">Reply</button>` 
                                : ''
                        }
                    </div>
                `;
            })
            .join(''); 
            // Join the HTML strings into a single HTML block
    }

    // Handle reply button click
    receivedMessagesContainer.addEventListener('click', (e) => {
        if (!e.target.classList.contains('reply-btn')) return; 
        // Exit if the clicked element is not a reply button

        replyToMessageId = e.target.dataset.id; 
        replyMessagePreview.textContent = `Replying to: "${e.target.dataset.content}"`; 
        replyModal.show(); 
    });

    // Send a reply
    sendReplyBtn.addEventListener('click', async () => {
        const content = replyMessageContent.value.trim(); 
        if (!content || !replyToMessageId) return; 
        // Exit if content is empty or no message ID is set

        try {
            await fetch('/api/messages/reply', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ message_id: replyToMessageId, content }), 
                // Send the reply content and message ID to the server
            });
            replyMessageContent.value = ''; 
            replyModal.hide(); 
            fetchMessages(); 
        } catch (err) {
            console.error('Error sending reply:', err); 
            // Log any errors during the reply request
        }
    });

    fetchMessages(); 
});
