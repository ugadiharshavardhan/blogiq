export const sendBrevoEmail = async (toEmail, toName, subject, htmlContent) => {
    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        const EMAIL_FROM = process.env.EMAIL_FROM;

        if (!BREVO_API_KEY || !EMAIL_FROM) {
            return { success: false, error: 'Brevo API key or Sender Email is missing in environment variables' };
        }

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: { email: EMAIL_FROM, name: "BlogIQ Admin" },
                to: [{ email: toEmail, name: toName }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getCreatorAcceptanceTemplate = (userName) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
        h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        h2 { color: #111827; font-size: 20px; margin-top: 0; }
        .cta-button { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 25px 0; text-align: center; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #f3f4f6; margin-top: 20px; }
        .highlight { color: #4f46e5; font-weight: 600; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to BlogIQ Creators</h1>
    </div>
    <div class="content">
        <h2>Congratulations, ${userName}! 🎉</h2>
        <p>We are thrilled to let you know that your application to become a <span class="highlight">BlogIQ Creator</span> has been reviewed and <strong>approved</strong> by our editorial team.</p>
        
        <p>You now have full access to our professional editorial suite where you can:</p>
        <ul style="color: #4b5563;">
            <li>Draft, format, and publish your own articles</li>
            <li>Reach our entire global audience</li>
            <li>Manage your content portfolio</li>
        </ul>

        <div style="text-align: center;">
            <a href="https://next-blog-app-iota.vercel.app/creator" class="cta-button">Go to Creator Dashboard</a>
        </div>

        <p>We can't wait to see the stories you'll share with the world.</p>
        <p>Best regards,<br><strong>The BlogIQ Admin Team</strong></p>
        
        <div class="footer">
            <p>If you have any questions, simply reply to this email or contact support.</p>
            <p>© ${new Date().getFullYear()} BlogIQ. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getCreatorRejectionTemplate = (userName) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
        h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        h2 { color: #111827; font-size: 20px; margin-top: 0; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #f3f4f6; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BlogIQ Creator Application Update</h1>
    </div>
    <div class="content">
        <h2>Hello ${userName},</h2>
        <p>Thank you for your interest in becoming a Creator on BlogIQ and for taking the time to submit your application.</p>
        
        <p>Our editorial team carefully reviews every application against our current content needs and quality guidelines. After reviewing your submission, we have decided <strong>not to move forward with your Creator application at this time.</strong></p>

        <p>Please know that this decision does not reflect negatively on you or your writing potential. Our platform needs and editorial constraints often dictate the volume of creators we can actively support.</p>

        <p>You can continue to enjoy and save all stories on BlogIQ as a regular user, and we encourage you to apply again in the future as our platform expands.</p>

        <p>Thank you again for your passion and understanding.</p>
        <p>Best regards,<br><strong>The BlogIQ Admin Team</strong></p>

        <div class="footer">
            <p>© ${new Date().getFullYear()} BlogIQ. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getBlogAcceptanceTemplate = (userName, blogTitle, blogUrl) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
        h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        h2 { color: #111827; font-size: 20px; margin-top: 0; }
        .cta-button { display: inline-block; background-color: #10b981; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 25px 0; text-align: center; }
        .blog-box { background: #f9fafb; border: 1px solid #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; font-style: italic; color: #4b5563; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #f3f4f6; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Your Blog is Live! 🎉</h1>
    </div>
    <div class="content">
        <h2>Great news, ${userName}!</h2>
        <p>Our editorial team has reviewed your submission and we are excited to let you know that your blog post has been <strong>approved and published</strong> on BlogIQ.</p>
        
        <div class="blog-box">
            "${blogTitle}"
        </div>

        <p>Your story is now available to our global audience. You can view it live, track its performance, or share it directly from your Creator Dashboard.</p>

        <div style="text-align: center;">
            <a href="${blogUrl}" class="cta-button">View Live Article</a>
        </div>

        <p>Keep up the fantastic work!</p>
        <p>Best regards,<br><strong>The BlogIQ Editorial Team</strong></p>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} BlogIQ. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getBlogRejectionTemplate = (userName, blogTitle, rejectionReason) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
        h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        h2 { color: #111827; font-size: 20px; margin-top: 0; }
        .cta-button { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 25px 0; text-align: center; }
        .blog-box { background: #f9fafb; border: 1px solid #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; font-weight: 500; color: #4b5563; }
        .reason-box { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #f3f4f6; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Update on your Submission</h1>
    </div>
    <div class="content">
        <h2>Hello ${userName},</h2>
        <p>Thank you for submitting your latest story to BlogIQ. Our editorial team recently completed a review of your submission:</p>
        
        <div class="blog-box">
            "${blogTitle}"
        </div>

        <p>Unfortunately, we are unable to publish this specific article at this time. The editorial team provided the following feedback for necessary revisions:</p>

        <div class="reason-box">
            <strong>Editor's Note:</strong><br>
            ${rejectionReason || "Please ensure all fields, including category tags and featured images, are properly completed and align with our platform quality standards."}
        </div>

        <p>You can easily update this text, fix the issues mentioned, and resubmit it for review right from your Editor dashboard!</p>

        <div style="text-align: center;">
            <a href="https://next-blog-app-iota.vercel.app/dashboard" class="cta-button">Go to Dashboard Editor</a>
        </div>

        <p>We look forward to reviewing your revised submission.</p>
        <p>Best regards,<br><strong>The BlogIQ Editorial Team</strong></p>

        <div class="footer">
            <p>© ${new Date().getFullYear()} BlogIQ. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
