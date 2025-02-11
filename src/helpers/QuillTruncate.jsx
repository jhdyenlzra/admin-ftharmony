import DOMPurify from "dompurify";

const truncateHtml = (html, limit) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const textContent = doc.body.textContent || "";
  return textContent.length > limit ? textContent.slice(0, limit) + "..." : textContent;
};

export const PostItemDescription = ({ description }) => {
  const sanitizedDescription = DOMPurify.sanitize(description);
  const preview = truncateHtml(sanitizedDescription, 100);

  return (
    <p
      className="postItemDescription"
      dangerouslySetInnerHTML={{ __html: preview }}
    />
  );
};