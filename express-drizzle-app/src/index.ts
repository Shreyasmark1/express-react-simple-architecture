import { startServer } from "./server";

const run = async () => {
    try {
        await startServer();
    }
    catch (error) {
        console.error(error);
    }
};
run();