import axios from "axios";

// Configure the client to connect to your local Ollama instance
const client = axios.create({
  baseURL: "http://localhost:11434/v1",
  headers: {
    Authorization: "Bearer ollama",
    "Content-Type": "application/json",
  },
});

export async function getChatCompletion(prompt: string) {
  try {
    const response = await client.post("/chat/completions", {
      model: "deepseek-r1:1.5b",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that generates a project structure from user prompts.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const data = response.data.choices[0].message.content;
    console.log("Response:", data);

    const responseFormat =
      "Response: <think> Okay, so I need to create a project structure for a portfolio website as an English Assistant Professor. Hmm, where do I start? Well, first off, I should think about what the main goals of this portfolio are. As an English professor, my primary goal is helping students improve their English skills through various projects and resources. So, the portfolio website will likely serve as a central hub for all these resources. It needs to be accessible to both students and faculty. Maybe it can include materials like lesson plans, reading assignments, writing prompts, and maybe even some interactive elements or multimedia content. I should consider how this website will be used by different users. Students might search for specific topics they're interested in, while faculty could use it to find teaching resources. It should also support collaboration between students and faculty, perhaps through shared projects or feedback mechanisms. Now, thinking about the structure, I need to break down the content into logical sections. Let me outline possible sections: 1. **About Us**: This would introduce the professor's name, their academic background, and what they offer. 2. **Resources**: Here, I can categorize resources by type—textbooks, reading assignments, writing prompts, etc. 3. **Projects**: This section could include student projects, research opportunities, maybe even guest lectures or workshops. 4. **Contact Us**: For any inquiries or support needed. 5. **Blog**: Maybe a regular blog with updates on teaching and learning strategies. 6. **Media Library**: A collection of educational media like videos, podcasts, etc. 7. **Events**: Information about conferences, workshops, or guest lectures the professor is involved in. Wait, I should make sure each section has clear headings and maybe some subheadings for more detailed information. Also, considering SEO, it's important to have keywords that potential users might search for, like English professor resources or writing prompts. I also need to think about how this website will be maintained. Should it be a static site on a domain name, or should there be some dynamic content? Maybe a mix of static and interactive elements would appeal to different user preferences. Another thought: accessibility. The website needs to be easy for everyone to use, including those with disabilities. I'll need to ensure that the design is accessible, maybe using alt text for images, proper contrast ratios, etc. Also, considering mobile optimization—since many users might access the site on their phones. I should check how responsive the site is and if any sections are too long or complicated for mobile viewing. I wonder about the technical aspects. What tools will be used to develop this website? HTML/CSS/JavaScript would be the basics, but maybe a framework like React or Vue.js could make it easier to build dynamic content. For static images, something like WordPress or Squarespace might work well. I should also think about SEO best practices—using meta tags, on-page keywords, and maybe even using Google's Keyword Planner tool to see how the site ranks in search results. Another consideration is user experience. The website needs to be easy to navigate, with clear sections for each purpose. Maybe some animations or hover effects could make it feel more engaging. I should also plan for future enhancements. If I can anticipate any new projects or resources, I might need to update the structure or add new sections as needed. Maybe having a roadmap would help in planning ahead. Lastly, I need to ensure that all links are correct and point to the right content. It's important to have accurate URLs so that users can easily find what they're looking for. Okay, putting this all together, I think I have a good outline of sections and considerations. Now, I should start fleshing out each section with detailed information, making sure it's organized and easy to navigate. </think> Creating a project structure for an English Assistant Professor's portfolio website involves several key steps and considerations to ensure effectiveness and user satisfaction. Here's a structured plan based on the thought process: ### 1. **Project Structure Outline** **A. About Us** - Introduce the professor's name, academic background, and mission. - Highlight expertise in specific areas like grammar, vocabulary, or writing. **B. Resources** - Organize resources into categories: Textbooks, Reading Assignments, Writing Prompts, etc. - Include links to relevant materials for students and faculty. **C. Projects** - Include student projects, research opportunities, guest lectures, workshops, and interactive elements. **D. Contact Us** - Provide contact information for inquiries or support needs. **E. Blog** - Regular updates on teaching strategies, learning resources, and trends. **F. Media Library** - Collection of educational media including videos, podcasts, and images. **G. Events** - Information about conferences, workshops, guest lectures, and relevant events. ### 2. **Technical Considerations** - **Development Tools**: Use HTML/CSS/JavaScript for basic structure, with frameworks like React or Vue.js for dynamic content. - **Mobile Optimization**: Ensure responsiveness and accessibility through proper contrast ratios and alt text for images. - **SEO Best Practices**: Incorporate meta tags, on-page keywords, and use tools like Google Keyword Planner to optimize rankings. ### 3. **User Experience Considerations** - **Navigability**: Clear sections with easy-to-use navigation. Consider animations or hover effects for engagement. - **Accessibility**: Ensure accessibility through proper contrast ratios, alt text, and proper web standards. ### 4. **Future Enhancements** - Anticipate future projects and resources to plan updates and additions as needed. ### 5. **Implementation Steps** 1. **Define Objectives**: Align the website with educational goals and user needs. 2. **Research Content**: Compile relevant materials into organized sections. 3. **Design and Develop**: Use appropriate tools for structure, design, and dynamic content. 4. **Test and Optimize**: Ensure functionality across devices and test accessibility. 5. **Launch and Monitor**: Track performance using analytics and gather feedback.       This structured approach ensures the portfolio website is both functional and engaging, supporting effective teaching and learning for English students.";

    return responseFormat;
  } catch (error: any) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to process the prompt.");
  }
}
