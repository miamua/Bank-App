
/*let getLogin = async() =>{
    let response = await fetch("http://localhost:3000/login");
    let message = await response.json();
    console.log('MESSAGE: ', message);
}
*/
let getLogin = async () => {
    try {
      const response = await axios.get('http://localhost:3000/login');
      const message = response.data;
      console.log('MESSAGE:', message);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };


