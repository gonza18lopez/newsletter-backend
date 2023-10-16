import * as bcrypt from "bcrypt";

(async function () {
    console.log(await bcrypt.hash("password", 10));
})();
