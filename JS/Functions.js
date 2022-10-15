import AsyncStorage from "@react-native-async-storage/async-storage";

export const save = async(key, value) => {
    try{
        await AsyncStorage.setItem(key, value)
        // console.log('Saved')
    } catch (err) {
      console.log(err)
    }
}

export const load = async(key) => {
    try{
        let value = await AsyncStorage.getItem(key)

        return value
    } catch(err) {
    //   console.log(err)
    }
}
export const clearAll = async() => {
    AsyncStorage.clear()
}