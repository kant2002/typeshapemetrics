type Dog = { bark(): void }
type Cat = { meow(): void }
type Animal = Dog | Cat
type NumberLike = number | string

function sound(animal: Dog | Cat) {

}
function sound2(animal: Dog | Cat | null) {
    
}
function sound3(animal: Dog | Cat | null | undefined) {
    
}
function sound4(animal: "dog" | "cat") {
    
}
function sound5(animal: 5 | 6) {
    
}
function sound6(animal: string) {
    
}
function sound7(animal: Animal) {
    
}
function sound8(): Dog | Cat {
    return { bark() {} }
}