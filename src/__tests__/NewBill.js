/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom"

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"

describe("Given I am connected as an employee", () => {
    beforeEach(() => {
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

        const onNavigate = jest.fn()

        const newBill = new NewBill({ document, onNavigate, store: mockStore })
    })
    describe("When I am on NewBill Page and upload a image", () => {
        test("Then the file input should show file name", async () => {
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

    describe("When I am on NewBill Page and upload a pdf file", () => {
        test("Then an alert should show and no file will be uploaded", async () => {
            const spyAlert = jest.spyOn(window, "alert")

            const fileInput = document.querySelector(
                `input[data-testid="file"]`
            )

            const file = new File([""], "test.pdf", { type: "application/pdf" })

            await waitFor(() =>
                fireEvent.change(fileInput, {
                    target: { files: [file] },
                })
            )

            expect(spyAlert).toHaveBeenCalled()
        })
    })

    describe("When I am on NewBill Page and submit the form", () => {
        test("Then an update called must be called", async () => {
            const spyUpdate = jest.spyOn(mockStore.bills(), "update")

            const fileInput = document.querySelector(
                `input[data-testid="file"]`
            )

            const file = new File([""], "test.png", { type: "image/png" })

            await waitFor(() =>
                fireEvent.change(fileInput, {
                    target: { files: [file] },
                })
            )
            const form = screen.getByTestId("form-new-bill")

            await waitFor(() => fireEvent.submit(form))

            expect(spyUpdate).toHaveBeenCalled()
        })
    })
})
