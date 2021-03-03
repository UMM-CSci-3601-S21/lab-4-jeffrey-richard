package umm3601.todo;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;


public class TodoControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private TodoController todoController;

  private ObjectId samsId;

  static MongoClient mongoClient;
  static MongoDatabase db;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
    MongoClientSettings.builder()
    .applyToClusterSettings(builder ->
    builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());

    db = mongoClient.getDatabase("test");
  }


  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testTodos = new ArrayList<>();
    testTodos.add(
      new Document()
        .append("owner", "Chris")
        .append("status", false)
        .append("category", "homework")
        .append("body", "Hi, I am Chris"));
    testTodos.add(
      new Document()
        .append("owner", "Patty")
        .append("status", true)
        .append("category", "groceries")
        .append("body", "Hi, I am Patty"));
    testTodos.add(
      new Document()
        .append("owner", "Joe")
        .append("status", false)
        .append("category", "groceries")
        .append("body", "Hi, I am Joe"));

    samsId = new ObjectId();
    Document sam =
      new Document()
        .append("_id", samsId)
        .append("owner", "Sam")
        .append("status", true)
        .append("body", "Hi, I am Sam");


    todoDocuments.insertMany(testTodos);
    todoDocuments.insertOne(sam);

    todoController = new TodoController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllTodos() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus());

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertEquals(db.getCollection("todos").countDocuments(), JavalinJson.fromJson(result, Todo[].class).length);
  }


  @Test
  public void GetTodosByOwner() throws IOException {

    // Set the query string to test with
    mockReq.setQueryString("owner=Chris");

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus()); // The response status should be 200

    String result = ctx.resultString();
    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    assertEquals(1, resultTodos.length); // There should be two todos returned
    for (Todo todo : resultTodos) {
      assertEquals("Chris", todo.owner); //
    }
  }

  @Test
  public void GetTodosByCategory() throws IOException {

    mockReq.setQueryString("category=groceries");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();

    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    assertEquals(2, resultTodos.length); // There should be two todos returned
    for (Todo todo : resultTodos) {
      assertEquals("groceries", todo.category);
    }
  }

  @Test

  public void GetTodosByBody() throws IOException {

    mockReq.setQueryString("body=Hi, I am Joe");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();

    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    assertEquals(1, resultTodos.length); // There should be one todos returned
    for (Todo todo : resultTodos) {
      assertEquals("Hi, I am Joe", todo.body);
    }
  }

  @Test

  public void GetTodosByStatus() throws IOException {

    mockReq.setQueryString("status=false");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
    todoController.getTodos(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();

    Todo[] resultTodos = JavalinJson.fromJson(result, Todo[].class);

    assertEquals(2, resultTodos.length); // There should be two todos returned
    for (Todo todo : resultTodos) {
      assertEquals(false, todo.status);
    }
  }

  @Test
  public void GetTodoWithExistentId() throws IOException {

    String testID = samsId.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", testID));
    todoController.getTodo(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Todo resultTodo = JavalinJson.fromJson(result, Todo.class);

    assertEquals(resultTodo._id, samsId.toHexString());
    assertEquals(resultTodo.owner, "Sam");
  }

  @Test
  public void GetTodoWithNonexistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      todoController.getTodo(ctx);
    });
  }

  @Test
  public void AddTodo() throws IOException {

    String testNewTodo = "{"
      + "\"owner\": \"Greg\","
      + "\"status\": true,"
      + "\"category\": \"gaming\","
      + "\"body\": \"Greg is testing his code.\""
      + "}";

    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    todoController.addNewTodo(ctx);

    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("todos").countDocuments(eq("_id", new ObjectId(id))));

    //verify todo was added to the database and the correct ID
    Document addedTodo = db.getCollection("todos").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedTodo);
    assertEquals("Greg", addedTodo.getString("owner"));
    assertEquals(true, addedTodo.getBoolean("status"));
    assertEquals("gaming", addedTodo.getString("category"));
    assertEquals("Greg is testing his code.", addedTodo.getString("body"));
  }


  @Test
  public void AddInvalidOwnerTodo() throws IOException {
    String testNewTodo = "{"
      + "\"status\": true,"
      + "\"category\": \"groceries\","
      + "\"body\": \"I am invalid.\","
      + "}";
    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    assertThrows(BadRequestResponse.class, () -> {
      todoController.addNewTodo(ctx);
    });
  }

  public void AddInvalidStatusTodo() throws IOException {
    String testNewTodo = "{"
      + "\"status\": hamburger,"
      + "\"category\": \"groceries\","
      + "\"body\": \"I am invalid.\","
      + "\"owner\": \"Barry.\","
      + "}";
    mockReq.setBodyContent(testNewTodo);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");

    assertThrows(BadRequestResponse.class, () -> {
      todoController.addNewTodo(ctx);
    });
  }


  @Test
  public void DeleteTodo() throws IOException {

    String testID = samsId.toHexString();

    // User exists before deletion
    assertEquals(1, db.getCollection("todos").countDocuments(eq("_id", new ObjectId(testID))));

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos/:id", ImmutableMap.of("id", testID));
    todoController.deleteTodo(ctx);

    assertEquals(200, mockRes.getStatus());

    // User is no longer in the database
    assertEquals(0, db.getCollection("todos").countDocuments(eq("_id", new ObjectId(testID))));
  }




}
