async function globalTeardown(){
    console.log('GLOBAL afterAll - Clean up testData, remove Auth token, etc.')
}

export default globalTeardown;