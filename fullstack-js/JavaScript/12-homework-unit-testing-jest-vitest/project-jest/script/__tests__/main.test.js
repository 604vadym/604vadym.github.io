import * as main from "../main.js";

describe("Module: main", () => {
    test("Function: ageClassification()", () => {
        expect(main.ageClassification(-1)).toBeNull();
    });
});
