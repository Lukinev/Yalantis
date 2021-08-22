#insert :
curl --location --request POST 'localhost:3000/api/userProfile/' \
--form 'name="User Name"' \
--form 'surname="user Surname"' \
--form 'email="some_mail@gmail.com"' \
--form 'photo=@"/{Fullpath to img}/img.png"'

#delete:
curl --location --request DELETE 'localhost:3000/api/userProfile/{userID}}'

#select list:
curl --location --request GET 'localhost:3000/api/userProfile/'
