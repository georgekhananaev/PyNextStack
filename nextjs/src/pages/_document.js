import Document, {Head, Html, Main, NextScript} from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8"/>
                    <meta name="description" content="PyNextStack is a full-stack system utilizing FastAPI with asynchronous capabilities on the backend and Next.js for the frontend showcases the robustness of Python in server-side development."/>
                    <link rel="stylesheet"
                          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
