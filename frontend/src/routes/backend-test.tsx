
import { createFileRoute } from "@tanstack/react-router";
import BackendApiTest from "../BackendApiTest";

export const Route = createFileRoute("/backend-test")({
    component: BackendApiTest,
});
