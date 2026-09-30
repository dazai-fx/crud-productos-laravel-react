<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Product::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product = new Product();
        $product->description = $request->description;
        $product->price = $request->price;
        $product->stock = $request->stock;

        $product->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Product::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($request->id);
        $product->description = $request->description;
        $product->price = $request->price;
        $product->stock = $request->stock;
        $product->save();
        return $product;

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return Product::destroy($id);
    }
}
