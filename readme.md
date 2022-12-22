## Elastic Dummy Server Setup For Testing

Basic **Express** server setup from which you can setup your elastic index/documents for local testing data (elastic should be on same system)

> Format to follow when posting data

***You have to make sure you have token/cookie info from elastic or else you will get elastic error unauthorized ***

- For Creating Index just call the API having param as indexName.

- For adding Documents inside Index The Data posted on the API for creating documents inside the index should be of type text/plain.
                            'Content-Type':'text/plain'

- The format should contain line breaks as shown below and the **even** indexes will have index name and **odd** indexes.
                            {"index":{"_index":"companydatabase","_type":"employees"}}
                Document-   {
                            FirstName: "ELVA",
                            LastName: "RECHKEMMER",
                            Designation: "CEO",
                            Salary: "154000",
                            DateOfJoining: "1993-01-11",
                            Address: "8417 Blue Spring St. Port Orange, FL 32127",
                            Gender: "Female",
                            Age: 62,
                            MaritalStatus: "Unmarried",
                            Interests:
                                "Body Building,Illusion,Protesting,Taxidermy,TV watching,Cartooning,Skateboarding",
                            }
                            

- The Output would be an object having keys data , error and status as indicators wheter the request passed or failed.

######                                     Sample Response

                            {data:"Some Data",error:null,status:200}
                            {data:null,error:"Some Error",status:400}

- After the response is successful, query the index with the below stated query
                            GET /${Index_Name}/_search
                            {"query":{"match_all":{}}}

- You should be able to see the documents inside your index.
