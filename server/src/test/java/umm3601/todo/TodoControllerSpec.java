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
        .append("category", "fishing")
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

  //@Test

  //public void GetAllTodos() throws IOException {

    // Create our fake Javalin context
  //  Context ctx = ContextUtil.init(mockReq, mockRes, "api/todos");
  //  todoController.getTodos(ctx);


  //  assertEquals(200, mockRes.getStatus());

  //  String result = ctx.resultString();
  //  assertEquals(db.getCollection("todo").countDocuments(), JavalinJson.fromJson(result, Todo[].class).length);
  //}


}
