const socket = io();
var mensajeDiv = document.getElementById("mensaje");
var datos = document.getElementById("datos");

//Mostrar datos de MongoDB de usuarios
socket.on("servidorEnviarUsuarios", (usuarios) => {
    var tr = "";
    usuarios.forEach((usuario, idLocal) => {
        tr = tr + `
        <tr>
            <td>${idLocal + 1}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.password}</td>
            <td>
                <a href="#" onClick="editarUsuario('${usuario._id}')">Editar /</a>
                <a href="#" onClick="borrarUsuario('${usuario._id}')">Borrar</a>
            </td>
        </tr>
        `;
    });
    datos.innerHTML = tr;
});

//Guardar datos de MongoDB de usuarios
var enviarDatos = document.getElementById("enviarDatos");
enviarDatos.addEventListener("submit", (e) => {
    e.preventDefault();
    var usuario = {
        id: document.getElementById("id").value,
        nombre: document.getElementById("nombre").value,
        usuario: document.getElementById("usuario").value,
        password: document.getElementById("password").value
    }
    socket.emit("clienteGuardarUsuario", usuario);
    socket.on("servidorUsuarioGuardado", (mensaje) => {
        console.log(mensaje);
        mensajeDiv.innerHTML = mensaje;
        setTimeout(() => {
            mensajeDiv.innerHTML = "";
        }, 2000);
    });

    document.getElementById("nombre").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("password").value = "";
    document.getElementById("nombre").focus()

});

//Modificar un registro de MongoDB de usuarios
function editarUsuario(id) {
    socket.emit("clienteObtenerUsuarioPorId", id);
}


socket.on("servidorObtenerUsuarioPorId", (usuario)=>{
    console.log(usuario);
    document.getElementById("id").value=usuario._id
    document.getElementById("nombre").value=usuario.nombre
    document.getElementById("usuario").value=usuario.usuario
    document.getElementById("password").value=usuario.password
    document.getElementById("txtNuevoUsuario").innerHTML="Editar usuario"
    document.getElementById("txtGuardarUsuario").innerHTML="Guardar cambios"
})

//Eliminar un registro de MongoDB de usuarios
function borrarUsuario(id) {
    socket.emit("clienteBorrarUsuario", id);
}