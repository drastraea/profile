document.addEventListener('DOMContentLoaded', () => {
    const taskbarItems = document.querySelectorAll('.taskbar-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Load posts when the page is initially loaded
    loadPosts();

    // Function to show a specific section and update the active taskbar item
    function showSection(targetId) {
        // Remove active class from all taskbar items
        taskbarItems.forEach(i => i.classList.remove('active'));

        // Hide all content sections
        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        // Show the selected content section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';

            // Add active class to the clicked taskbar item
            const activeItem = Array.from(taskbarItems).find(i => i.getAttribute('data-target') === targetId);
            if (activeItem) 
                activeItem.classList.add('active');
            
        }
    }

    // Handle clicks on taskbar items
    taskbarItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Prevent default anchor behavior
            event.preventDefault();
            // Get target id and show the corresponding section
            const targetId = item.getAttribute('data-target');
            showSection(targetId);
        });
    });

    // Handle clicks on links in the content sections
    const aboutSectionLinks = document.querySelectorAll('#about-section a');

    aboutSectionLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default anchor behavior
            const targetId = link.getAttribute('href').substring(1); // Get the target ID
            showSection(targetId); // Show the corresponding section
        });
    });

    // Check if there's a hash in the URL and show the corresponding section
    const hash = window.location.hash.substring(1); // Remove the '#' character
    if (hash) {
        showSection(hash); // Show the section based on the hash
    } else {
        showSection('about-section'); // Default to the about section
    }

    /**
     * Function to load and display posts in the Settings section
     */
    async function loadPosts() {
        const postsContainer = document.getElementById('posts-container');

        // Clear existing posts
        postsContainer.innerHTML = '';

        try {
            // Fetch the JSON data from the external URL
            const response = await fetch('https://mayicu.id/random');

            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON data
            const jsonData = await response.json();

            // Validate that jsonData is an array
            if (!Array.isArray(jsonData)) {
                throw new Error('Invalid JSON format: Expected an array');
            }

            // Iterate over each post in the JSON data
            jsonData.forEach(post => {
                // Ensure the required fields exist
                if (
                    typeof post.post_title === 'undefined' ||
                    typeof post.post_description === 'undefined' ||
                    typeof post.post_title_seo === 'undefined' ||
                    typeof post.post_type === 'undefined'
                ) {
                    console.warn('Missing fields in post:', post);
                    return; // Skip this post
                }

                // Create post container
                const postDiv = document.createElement('div');
                postDiv.classList.add('post');

                // Create post title
                const postTitle = document.createElement('h2');
                postTitle.textContent = post.post_title;
                postDiv.appendChild(postTitle);

                // Create post description
                const postDescription = document.createElement('p');
                postDescription.textContent = post.post_description;
                postDiv.appendChild(postDescription);

                // Create a link to the post
                const postLink = document.createElement('a');
                postLink.href = `https://mayicu.id/${post.post_type}/${post.post_title_seo}`;
                postLink.textContent = 'Read More';
                postDiv.appendChild(document.createElement('br')); // Line break
                postDiv.appendChild(postLink);

                // Append the post to the container
                postsContainer.appendChild(postDiv);
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
        }
    }

    /**
     * Utility function to capitalize the first letter of a string
     * @param {string} string
     * @returns {string}
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
