using Api.Dtos.TaskItems;
using Api.Security.Jwt;
using Api.Services.TaskItemsServices;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TaskItemsController : ControllerBase
{
    private readonly CreateTaskItem _createTaskItem;
    private readonly DeleteTaskItem _deleteTaskItem;
    private readonly GetAllTaskItems _getAllTaskItems;
    private readonly GetTaskItemById _getTaskItemById;
    private readonly GetTaskItemOptions _getTaskItemOptions;
    private readonly SearchTaskItems _searchTaskItems;
    private readonly UpdateTaskItem _updateTaskItem;

    public TaskItemsController(
        CreateTaskItem createTaskItem,
        DeleteTaskItem deleteTaskItem,
        GetAllTaskItems getAllTaskItems,
        GetTaskItemById getTaskItemById,
        GetTaskItemOptions getTaskItemOptions,
        SearchTaskItems searchTaskItems,
        UpdateTaskItem updateTaskItem)
    {
        _createTaskItem = createTaskItem;
        _deleteTaskItem = deleteTaskItem;
        _getAllTaskItems = getAllTaskItems;
        _getTaskItemById = getTaskItemById;
        _getTaskItemOptions = getTaskItemOptions;
        _searchTaskItems = searchTaskItems;
        _updateTaskItem = updateTaskItem;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        var result = await _getAllTaskItems.ExecuteAsync(page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var result = await _getTaskItemById.ExecuteAsync(id);
        return Ok(result);
    }

    [HttpGet("options")]
    public async Task<ActionResult> GetOptions()
    {
        var result = await _getTaskItemOptions.ExecuteAsync();
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<ActionResult> Search(
        [FromQuery] string key,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10
    )
    {
        var result = await _searchTaskItems.ExecuteAsync(key, page, pageSize);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] CreateTaskItemDto dto)
    {
        var authUserId = User.GetUserId();
        var result = await _createTaskItem.ExecuteAsync(dto, authUserId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateTaskItemDto dto)
    {
        var authUserId = User.GetUserId();
        var result = await _updateTaskItem.ExecuteAsync(id, dto, authUserId);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var authUserId = User.GetUserId();
        await _deleteTaskItem.ExecuteAsync(id, authUserId);
        return NoContent();
    }

}