/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom"

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page and upload a image", () => {
        test("Then the file input should show file name", async () => {
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            })
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                    email: "test@gmail.com",
                })
            )

            const html = NewBillUI()
            document.body.innerHTML = html

            const newBill = new NewBill({ document, store: mockStore })

            const fileInput = document.querySelector(
                `input[data-testid="file"]`
            )

            const file = new File([""], "test.png", { type: "image/png" })

            await waitFor(() =>
                fireEvent.change(fileInput, {
                    target: { files: [file] },
                })
            )
            expect(fileInput.files[0].name).toEqual("test.png")
        })
    })
})
