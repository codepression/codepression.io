import createClient from "openapi-fetch";

import { paths } from "./schema";

const vrchatClient = createClient<paths>({
  baseUrl: "https://vrchat.com/api/1",
});

export default vrchatClient;
